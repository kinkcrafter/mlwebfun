using Microsoft.Owin.Hosting;
using System;

namespace MLTest
{
    class Program
    {
        static IDisposable server;

        static void Main(string[] args)
        {
            InitializeOwin();

            Console.WriteLine("Press any Key to close!");
            Console.ReadKey();
        }


        private static void InitializeOwin()
        {
            server = WebApp.Start<Startup>("http://*:12346");
        }
    }
}
