using Raven.Client;
using Raven.Client.Document;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Speakr.Data
{
    public static class RavenInstance
    {
        public static readonly IDocumentStore Db = CreateDb();

        private static IDocumentStore CreateDb()
        {
            var db = new DocumentStore { ConnectionStringName = "RavenDB" };
            db.Initialize();
            return db;
        }
    }
}