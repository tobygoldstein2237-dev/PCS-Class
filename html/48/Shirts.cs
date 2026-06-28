namespace HW48 {
    internal class Shirts {

        public string Color {get; set;}
        public string Pattern { get; set; }

        public Shirts (string color, string pattern) {
            Color = color;
            Pattern = pattern;
        }

        public override string ToString() {
            return $"{Color} : {Pattern}";
        }

    }
}
