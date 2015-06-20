using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebStart.Models;

namespace WebStart.Controllers
{
    public class ErrorController : ApiController
    {

        // POST: api/Error
        public void Post([FromBody]ErrorReport report)
        {
            // TODO: validate lengths of incomming data fields to reject malicious error reports

            report.Useragent = Request.Headers.UserAgent.ToString();
            report.Timestamp = DateTime.UtcNow.ToString(System.Globalization.CultureInfo.InvariantCulture);
            System.Diagnostics.Trace.TraceWarning("Client Reported Error\r\n" + JsonConvert.SerializeObject(report, Formatting.Indented));
        }
    }
}
