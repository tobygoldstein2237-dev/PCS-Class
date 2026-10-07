export default function (selector) {
    const element = getElement(selector);

    return {
        css: function (property, value) {
            console.log(arguments);

            if (arguments.length < 2) {
                return getCss(element, property);
            } else {
                setCss(element, property, value);
            }
        },

        on: (eventType, callback) => on(element, eventType, callback),

        click: callback => click(element, callback),

        hide: () => setCss(element, 'display', 'none'),

        show: () => setCss(element, 'display', 'inline-block'),

        sparkle: (length, speed = 500) => {
            const colors = ['red', 'blue', 'green', 'orange', 'purple'];
            let index = 0;

            const interval = setInterval(() => {
                setCss(element, 'color', colors[index]);
                index = (index + 1) % colors.length;
            }, speed);

            setTimeout(() => {
                clearInterval(interval);
            }, length);
        }
    };
}

