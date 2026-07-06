// dbManager.js - Crear un módulo separado para manejar la DB
import { createStore } from 'idb-keyval';
export const DB_NAME = 'fenestraedb';
export const DB_VERSION = 1; 

class DBManager {
  constructor(dbName, version) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.isUpgrading = false;
    this.stores = {}; // Inicializado siempre aquí
  }
  
  async init() {
    // Esperar a que terminen otras conexiones
    if (this.db) return this.db;
    
    await this.waitForOtherConnections();
    
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
     // console.log(`[DB] Abriendo base de datos: ${this.dbName} (v${this.version})`);      


      
      request.onupgradeneeded = (event) => {
        this.isUpgrading = true;
        const db = event.target.result;
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion;
        
       // console.log(`[DB] Actualizando de versión ${oldVersion} a ${newVersion}`);
        
        // Migrar datos según la versión
        if (oldVersion < 1) {
          this.createStores(db);
        }

       
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isUpgrading = false;
        
        this.db.onversionchange = () => {
          this.handleVersionChange();
        };
        
        resolve(this.db);
      };
      
      request.onerror = (event) => {
        this.isUpgrading = false;
        reject(event.target.error);
      };
      
      request.onblocked = () => {
        this.handleBlocked();
      };
    });
  }

  createStores(db) {
    const stores = ['main', 'windows'];
    stores.forEach(name => {
      if (!db.objectStoreNames.contains(name)) {
        // Esto es lo que crea la carpeta en "Application > IndexedDB"
        db.createObjectStore(name);
       // console.log(`[DB] FÍSICO: Store '${name}' creado en el disco.`);
      }
    });
  }

  
  async waitForOtherConnections() {
    // Dar tiempo a que otras conexiones se cierren
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  handleVersionChange() {
    console.warn("[DB] Versión cambiada, cerrando conexión...");
    if (this.db) {
      this.db.close();
    }
    // Recargar la página después de un breve delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }
  
  handleBlocked() {
    //console.warn("[DB] Actualización bloqueada");
    const userConfirmed = window.confirm(
      "La aplicación necesita actualizarse. ¿Deseas cerrar otras pestañas y recargar?"
    );
    if (userConfirmed) {
      // Sugerir al usuario cerrar otras pestañas
      window.location.reload();
    }
  }
  
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  getCustomStore(storeName) {
    // Verificación de seguridad extra
    if (!this.stores) this.stores = {};

    if (!this.stores[storeName]) {
      console.log(`[DB] Creando referencia idb-keyval para: ${storeName}`);
      this.stores[storeName] = createStore(this.dbName, storeName);
    }
    return this.stores[storeName];
  }
 
}

const dbManagerInstance = new DBManager(DB_NAME, DB_VERSION);
export default dbManagerInstance;