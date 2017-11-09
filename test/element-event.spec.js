describe("Element-Event", function () {

    it("bind click", function (done) {
        var clicked = 0;

        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}" on-click="clicker(name, email, $event)" style="color: red; cursor: pointer">{{name}}, please click here!</span></a>',

            clicker: function (name, email, event) {
                expect(name).toBe('errorrik');
                expect(email).toBe('errorrik@gmail.com');
                expect(event.target || event.srcElement).toBe(span);

                clicked = 1;
            }
        });
        var myComponent = new MyComponent();
        myComponent.data.set('name', 'errorrik');
        myComponent.data.set('email', 'errorrik@gmail.com');

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);

        var span = wrap.firstChild.firstChild;
        expect(span.getAttribute('title')).toBe('errorrik');

        function doneSpec() {

            if (clicked) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);

                return;
            }

            setTimeout(doneSpec, 500);
        }

        triggerEvent('#' + span.id, 'click');

        doneSpec();

    });

    it("bind click fire default event", function (done) {
        var clicked = 0;

        var MyComponent = san.defineComponent({
            template: '<a><span title="{{name}}" on-click="clicker()" style="color: red; cursor: pointer">please click here!</span><span title="{{name}}" on-click="clickerNoArgs" style="color: red; cursor: pointer">please click here!</span></a>',

            clicker: function (event) {
                expect(event.target || event.srcElement).toBe(span);
                clicked += 1;
            },
            clickerNoArgs: function (event) {
                expect(event.target || event.srcElement).toBe(spanNoArgs);
                clicked += 1;
            }
        });
        var myComponent = new MyComponent();

        var wrap = document.createElement('div');
        document.body.appendChild(wrap);
        myComponent.attach(wrap);
        var span = wrap.firstChild.firstChild;
        var spanNoArgs = wrap.firstChild.lastChild;
        function doneSpec() {
            if (clicked == 2) {
                done();
                myComponent.dispose();
                document.body.removeChild(wrap);
                return;
            }
            setTimeout(doneSpec, 500);
        }

        triggerEvent('#' + span.id, 'click');
        triggerEvent('#' + spanNoArgs.id, 'click');
        doneSpec();
    });

});
