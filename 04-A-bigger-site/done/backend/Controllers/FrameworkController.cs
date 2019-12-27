using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FrameworkController : Controller
    {
        [HttpGet]
        public List<Framework> Get()
        {
            return FrameworkDataStore.Database;
        }

        [HttpGet("{id}")]
        public Framework Get(int id)
        {
            return (
                from d in FrameworkDataStore.Database
                where d.Id == id
                select d
            ).FirstOrDefault();
        }

        // TODO: why doesn't [FromBody] work?

        // new
        [HttpPost]
        public Framework Post([FromBody]Framework model)
        {
            model.Votes = 0;

            int id = (int?)(
                from d in FrameworkDataStore.Database
                orderby d.Id descending
                select d.Id
            ).FirstOrDefault() ?? 0;

            model.Id = id + 1;
            FrameworkDataStore.Database.Add(model);

            return model;
        }

        // update
        [HttpPut("{id}")]
        public Framework Put(int id, [FromBody]Framework model)
        {
            Framework framework = (
                from d in FrameworkDataStore.Database
                where d.Id == id
                select d
            ).FirstOrDefault();
            if (framework != null) {
                framework.Name = model.Name;
            }

            return framework;
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            Framework framework = (
                from d in FrameworkDataStore.Database
                where d.Id == id
                select d
            ).FirstOrDefault();
            if (framework != null) {
                FrameworkDataStore.Database.Remove(framework);
            }
        }
    }
}
