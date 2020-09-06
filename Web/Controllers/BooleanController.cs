using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace MLTest.Web.Controllers
{
    public class BooleanController : ApiController
    {
        public string Get(string value)
        {
            // Do some thing if its true
            if (value.ToLower() == "true")
            {
                // Write some code that does something interesting here...
            }
            // Do the opposite
            else
            {
                // Write some code that does something interesting here...
            }

            return "accepted!";
        }
    }
}
