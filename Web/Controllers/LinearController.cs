using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace MLTest.Web.Controllers
{
    public class LinearController : ApiController
    {
        public string Get(int value)
        {
            // Do something interesting with the value, should be 1-100

            return "accepted!";
        }
    }
}
