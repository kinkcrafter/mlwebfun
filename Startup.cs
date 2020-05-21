using Microsoft.Owin.FileSystems;
using Microsoft.Owin.StaticFiles;
using Owin;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace MLTest

{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            string strExeFilePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
            string exePath = Path.GetDirectoryName(strExeFilePath);


            HttpConfiguration config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();

            app.UseWebApi(config);

#if DEBUG
            exePath = Directory.GetParent(Directory.GetParent(exePath).FullName).FullName; 
#endif
            var physicalFileSystem = new PhysicalFileSystem(exePath + "\\Web");

            var options = new FileServerOptions
            {
                EnableDefaultFiles = true,
                FileSystem = physicalFileSystem,
                EnableDirectoryBrowsing = true
            };
            options.StaticFileOptions.FileSystem = physicalFileSystem;
            options.StaticFileOptions.ServeUnknownFileTypes = true;
            options.DefaultFilesOptions.DefaultFileNames = new[] { "index.html" };
            app.UseFileServer(options);
        }
    }
}
