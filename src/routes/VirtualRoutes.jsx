export function getVirtualRouteForWindow(win) {
  if (!win) return "/app";

  if (win.name === "launchpad") return "/app";

  const clean = { ...win.params };
  delete clean.winId;
  delete clean.isTab;
  delete clean.isFloat;
  delete clean.parentId;

  const payload = btoa(JSON.stringify(clean));

  return `/app/erp#${payload}`;
}


export function getVirtualRouteForWindow2(win) 
{
      if (!win) return "/app";
       if (win.name === "launchpad")
         return "/app"; 
        const base = `/app/${win.name.toLowerCase()}`;
         const query = serializeParams(win.params);
          return `${base}${query}`
}   

export function serializeParams(params) {
  const clean = { ...params };

  delete clean.winId;
  delete clean.isTab;
  delete clean.isFloat;
  delete clean.parentId;

  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : "";
}
