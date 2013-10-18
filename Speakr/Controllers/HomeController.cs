using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Speakr.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                ViewBag.UserName = User.Identity.Name;
            }
            else
            {
                ViewBag.UserName = string.Empty;
            }

            // Cheap way to track a user. We did do full auth with Mozilla Persona,
            // but we pulled this code out and instead did simple session tracking.
            var sessionCookieName = "SpeakrSessionId";
            var sessionCookie = Request.Cookies[sessionCookieName];
            if (sessionCookie == null || string.IsNullOrEmpty(sessionCookie.Value))
            {
                var cookie = new HttpCookie(sessionCookieName, Guid.NewGuid().ToString());
                cookie.Expires = DateTime.Now.AddYears(3);
                Response.SetCookie(cookie);
            }

            return View();
        }
    }
}