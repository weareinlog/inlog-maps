export default class NavigationOptions {
    public color?: string;
    public weight?: number;
    public navigateByPoint: boolean; // Set to false when you want to navigate by stretch, and not by points

    constructor(color?: string, weight?: number, navigateByPoint: boolean = true) {
        this.color = color;
        this.weight = weight;
        this.navigateByPoint = navigateByPoint;
    }
}
