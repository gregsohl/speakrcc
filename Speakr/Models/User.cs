using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Models
{
    public class User
    {
        public User()
        {
            this.Ratings = new List<TalkRating>();
        }

        public string Email { get; set; }
        public List<TalkRating> Ratings { get; set; }
    }
}