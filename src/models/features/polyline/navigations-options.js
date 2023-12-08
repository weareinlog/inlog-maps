var NavigationOptions = /** @class */ (function () {
    function NavigationOptions(color, weight, navigateByPoint, opacity) {
        if (navigateByPoint === void 0) { navigateByPoint = true; }
        if (opacity === void 0) { opacity = 1; }
        this.style = undefined;
        this.editable = false;
        this.color = color;
        this.weight = weight;
        this.opacity = opacity;
        this.navigateByPoint = navigateByPoint;
        this.navegateOnKeyPress = false;
    }
    return NavigationOptions;
}());
export default NavigationOptions;
//# sourceMappingURL=navigations-options.js.map