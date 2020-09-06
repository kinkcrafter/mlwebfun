using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace MLTest.Web.Controllers
{
    public class ImageController : ApiController
    {
        public string Post(string value, [FromBody]CamImage image)
        {
            string directory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MLFun");

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            string filename = $"{directory}smartcam-{DateTime.UtcNow.ToString("yy-MM-dd-HH-mm-ss")}.png";

            // you can save this file then do something interesting with it here...  Up to you!

            using (FileStream fs = new FileStream(filename, FileMode.Create))
            {
                using (BinaryWriter bw = new BinaryWriter(fs))
                {
                    byte[] data = Convert.FromBase64String(image.ImageData);
                    bw.Write(data);
                    bw.Close();
                }
            }

            return $"Photo saved to {filename}";
        }

        public string Get(string value)
        {
            string directory = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "MLFun");

            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            Process.Start(directory);

            return "Opened";
        }
    }

    public class CamImage
    {
        public string ImageData { get; set; }
    }
}
