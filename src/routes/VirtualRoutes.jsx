export function getVirtualRouteForWindow(win) {
  if (!win) return "/app";

  if (win.name === "launchpad") return "/app";

  const name = encodeURIComponent((win.name || "window").toLowerCase());
  const id = win.params?.id;
  return id != null ? `/app/${name}?id=${encodeURIComponent(String(id))}` : `/app/${name}`;
}


export function getVirtualRouteForWindow2(win) 
{
      if (!win) return "/app";
       if (win.name === "launchpad")
         return "/app"; 
        const base = `/app/${encodeURIComponent((win.name || "window").toLowerCase())}`;
         const query = serializeParams(win.params);
          return `${base}${query}`
}   

export function serializeParams(params) {
  if (!params || params.id == null) return "";
  return `?${new URLSearchParams({ id: String(params.id) }).toString()}`;
}
