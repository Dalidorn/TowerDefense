export class Polygon {
    constructor(vertices) {
        this.vertices = vertices;
        this.boundingBox = this.calculateBoundingBox(vertices); // Calculate bounding box
    }

    // Calculate the bounding box of the polygon
    calculateBoundingBox(vertices) {
        let minX = vertices[0].x;
        let maxX = vertices[0].x;
        let minY = vertices[0].y;
        let maxY = vertices[0].y;

        for (let i = 1; i < vertices.length; i++) {
            const { x, y } = vertices[i];
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }

        return {
            left: minX,
            right: maxX,
            top: minY,
            bottom: maxY
        };
    }

    lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        // Check if the line has hit any of the rectangle's sides
        // Uses the lineLine function below
        const left = this.lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh);
        const right = this.lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh);
        const top = this.lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry);
        const bottom = this.lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

        // If ANY of the above are true,
        // the line has hit the rectangle
        if (left || right || top || bottom) {
            return true;
        }

        return false;
    }

    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    
        if (denominator === 0) {
            // Lines are parallel, they won't intersect
            return false;
        }
    
        const uA = ((x4 - x3) * (y1 - y3) + (y4 - y3) * (x3 - x1)) / denominator;
        const uB = ((x2 - x1) * (y1 - y3) + (y2 - y1) * (x3 - x1)) / denominator;
    
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
        }
    
        return false;
    }

    polyRect(rx, ry, rw, rh) {
        // Check if the bounding boxes intersect
        if (
            this.boundingBox.left > rx + rw ||
            this.boundingBox.right < rx ||
            this.boundingBox.top > ry + rh ||
            this.boundingBox.bottom < ry
        ) {
            // Bounding boxes do not intersect, no need to check further
            return false;
        }

        // Go through each of the vertices, plus the next
        // vertex in the list
        let next = 0;
        for (let current = 0; current < this.vertices.length; current++) {
            // Get next vertex in list
            // If we've hit the end, wrap around to 0
            next = current + 1;
            if (next === this.vertices.length) next = 0;

            // Get the vertices at our current position
            // This makes our if statement a little cleaner
            const vc = this.vertices[current]; // c for "current"
            const vn = this.vertices[next]; // n for "next"

            // Check against all four sides of the rectangle
            const collision = this.lineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh);
            if (collision) return true;
        }

        return false;
    }
}
