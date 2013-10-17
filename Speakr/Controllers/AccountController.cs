using Newtonsoft.Json;
using Speakr.Data;
using Speakr.Models;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Text;
using System.Transactions;
using System.Web.Mvc;
using System.Web.Security;

namespace Speakr.Controllers
{
    public class AccountController : Controller
    {
        [AllowAnonymous]
        [HttpPost]
        public JsonResult PersonaLogin(string assertion)
        {
            using (var web = new WebClient())
            {
                // Build the data we're going to POST.
                var data = new NameValueCollection();
                data["assertion"] = assertion;
                data["audience"] = String.Format("{0}://{1}", Request.Url.Scheme, Request.Url.Authority); // "https://example.com:443"; // Use your website's URL here.

                // POST the data to the Persona provider (in this case Mozilla)
                var response = web.UploadValues("https://verifier.login.persona.org/verify", "POST", data);
                var buffer = Encoding.Convert(Encoding.GetEncoding("iso-8859-1"), Encoding.UTF8, response);

                var tempstring = Encoding.UTF8.GetString(buffer, 0, response.Length);
                dynamic reader = JsonConvert.DeserializeObject(tempstring);

                if (reader.status.Value == "okay")
                {
                    var emailAddress = (string)reader.email.Value;
                    FormsAuthentication.SetAuthCookie(emailAddress, true);

                    using (var session = RavenInstance.Db.OpenSession())
                    {
                        if (session.Query<User>().FirstOrDefault(u => u.Email == emailAddress) == null)
                        {
                            session.Store(new User { Email = emailAddress });
                            session.SaveChanges();
                        }
                    }
                }
                return Json(new { Status = reader.status.Value, Email = reader.email.Value });
            }
        }

        [HttpPost]
        [Authorize]
        public ActionResult PersonaLogout()
        {
            FormsAuthentication.SignOut();
            return Redirect("/");
        }

        [HttpPost]
        public JsonResult Priv(string talkId)
        {
            if (!User.Identity.IsAuthenticated)
            {
                throw new Exception("Nope!");
            }

            return Json("Ok!");
        }
    }
}