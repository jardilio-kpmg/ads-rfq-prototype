using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Routing;

namespace WebStart
{
    public class SpaContentHandler : IRouteHandler
    {
        static StaticFileHandler handlerInstance = new StaticFileHandler();
        public IHttpHandler GetHttpHandler(RequestContext requestContext)
        {
            return handlerInstance;
        }

        private class StaticFileHandler : IHttpHandler
        {
            private string staticFilePath = HttpContext.Current.Server.MapPath("~/ClientBuild");
            private static TimeSpan sixMonths = new TimeSpan(180, 0, 0, 0);

            public void ProcessRequest(HttpContext context)
            {
                var requestedFile = context.Request.Url.AbsolutePath;
                string fileToServe = null;

                if (requestedFile.Contains('.'))
                {
                    // If the request includes a '.' then we'll try to find that file
                    fileToServe = staticFilePath + requestedFile;

                    // If the requested file exists as part of the client-side build, use it
                    if (File.Exists(fileToServe))
                    {
#if !DEBUG
                        // These files should be cached for a long time since their names
                        // are expected to contain cache-busters
                        context.Response.Cache.SetCacheability(HttpCacheability.Public);
                        context.Response.Cache.SetExpires(DateTime.Now.Add(sixMonths));
                        context.Response.Cache.SetMaxAge(sixMonths);
#else
                        // For debug builds, prevent caching of these files
                        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                        context.Response.Cache.SetExpires(DateTime.Now);
                        context.Response.Cache.SetMaxAge(TimeSpan.Zero);
#endif
                    }
                    else
                    {
                        // Return 404 if the requested file is not found
                        context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                        context.Response.StatusCode = 404;
                        context.ApplicationInstance.CompleteRequest();
                        return;
                    }
                }
                else
                {
                    // Return index.html from the client-side build.
                    // The client-side router will determine what to actually display
                    fileToServe = staticFilePath + "/index.html";

                    // This page should never be cached
                    context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
                    context.Response.Cache.SetExpires(DateTime.Now);
                    context.Response.Cache.SetMaxAge(TimeSpan.Zero);
                }

                context.Response.Clear();
                context.Response.ContentType = MimeMapping.GetMimeMapping(fileToServe);
                context.Response.WriteFile(fileToServe);
                context.ApplicationInstance.CompleteRequest();
            }

            public bool IsReusable
            {
                get { return true; }
            }
        }

    }

}