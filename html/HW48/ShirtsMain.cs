using System;
using System.Collections.Generic;
using System.Text;

namespace HW48 {
    internal class ShirtsMain {

        static void Main(string[] args) {
            string[] Colors = { "red", "green", "blue" };
            string[] Patterns = { "striped", "checked", "plain" };


            foreach (string color in Colors) {
                foreach (string pattern in Patterns) {
                    Shirts shirt = new Shirts(color, pattern);
                    Console.WriteLine(shirt);
                }
            }
        }
    }
}
