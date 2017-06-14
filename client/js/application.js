$(window).ready(() => {
    $(window).bind('hashchange', () => {
        window.app.controller.render()
    });
    window.app.controller.render();
});
