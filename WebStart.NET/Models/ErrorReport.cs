using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebStart.Models
{
    public class ErrorReport
    {
        public string ID { get; set; }
        public string Timestamp { get; set; }
        public string Useragent { get; set; }
        public int ErrorCode { get; set; }
        public string Message { get; set; }
        public int URL { get; set; }
        public string[] LogHistory { get; set; }
    }
}