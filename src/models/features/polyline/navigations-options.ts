export default class NavigationOptions {
    public color?: string;
    public weight?: number;
    public opacity?: number;
    public navigateByPoint: boolean; // Set to false when you want to navigate by stretch, and not by points

    constructor(color?: string, weight?: number, navigateByPoint: boolean = true, opacity = 1) {
        this.color = color;
        this.weight = weight;
        this.opacity = opacity;
        this.navigateByPoint = navigateByPoint;
    }
}
