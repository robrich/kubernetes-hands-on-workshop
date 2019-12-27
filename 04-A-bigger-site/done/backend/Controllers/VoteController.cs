using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VoteController : Controller
    {
        [HttpGet]
        public List<Framework> Get()
        {
            return FrameworkDataStore.Database;
        }
        
        // add 1 vote
        [HttpPost("{id}")]
        public Framework Post(int id)
        {
            Framework framework = (
                from d in FrameworkDataStore.Database
                where d.Id == id
                select d
            ).FirstOrDefault();
            if (framework != null) {
                framework.Votes++;
            }
            return framework;
        }
        
        // remove 1 vote
        [HttpDelete("{id}")]
        public Framework Delete(int id)
        {
            Framework framework = (
                from d in FrameworkDataStore.Database
                where d.Id == id
                select d
            ).FirstOrDefault();
            if (framework != null && framework.Votes > 0) {
                framework.Votes--;
            }
            return framework;
        }
    }
}
