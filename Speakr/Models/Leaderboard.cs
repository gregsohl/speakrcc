using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Models
{
    public class Leaderboard
    {
        public string TalkId { get; set; }
        public int Ranking { get; set; }
        public DateTime Time { get; set; }
    }
}