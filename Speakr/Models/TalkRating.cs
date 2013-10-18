using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Models
{
    public class TalkRating
    {
        public string TalkId { get; set; }
        public bool UpVote { get; set; }
    }
}