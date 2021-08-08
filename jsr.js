
var svg = document.getElementById('svg');
var InsFlag = 0;
var diagFlag = 0;
// console.log(screen.width, screen.height)

var size = 30;
let rows = Math.floor(screen.height/size)-4
let cols = Math.floor(screen.width/size);
var arr = new Array(rows).fill(0).map(() => new Array(cols).fill(0));
var wallColor = "rgb(16,47,125)";
var start =  [1*Math.floor(screen.width/3/size), Math.floor(screen.height/3/size)]; //starting Starting point
var end = [2*Math.floor(screen.width/3/size), Math.floor(screen.height/3/size)]; //starting End point
var currStart = [start];
// console.log(currStart[0]);
// console.log(currStart[0][0]);
var currEnd = [end];
var emptyColor = "rgb(15,15,15)";
// console.log(start,end)

const svgns = "http://www.w3.org/2000/svg";
initialize = () => {
    for (let r = 0; r < arr.length; r++){
        for (let c = 0; c < arr[r].length; c++){
            let newRect = document.createElementNS(svgns, "rect");
            newRect.setAttribute("id", r+"|"+c)
            newRect.setAttribute("x", c*size);
            newRect.setAttribute("y", r*size);
            newRect.setAttribute("width", size);
            newRect.setAttribute("height", size);
            if (c == start[0] && r == start[1]){
                newRect.setAttribute("fill", "rgb(255,0,0)");   //start square
            } else if (c == end[0] && r == end[1]){ 
                newRect.setAttribute("fill", "rgb(0,255,0)");   //end square
            } else {
                newRect.setAttribute("fill", emptyColor);   //empty squares
            }
            newRect.setAttribute("stroke-width", 3);
            newRect.setAttribute("stroke", "rgb(50,50,50)");
            newRect.setAttribute("onmouseover", "HoldHover(this.id)");
            newRect.setAttribute("onmousedown", "HoldClick(this.id)");
            svg.appendChild(newRect);
        }
    }
}

initialize();



HoldHover = (id) => {
    let rect = svg.querySelector("rect[id='"+id+"']");  
    var ind = id.split('|').map(Number);
    if (mouseDown == 1 && InsFlag == 0){
        if ( (ind[1] != currStart[0][0] || ind[0] != currStart[0][1]) && (ind[1] != currEnd[0][0] || ind[0] != currEnd[0][1]) ){
            rect.style.fill = wallColor;
            arr[ind[0]][ind[1]] = 1;
        }

        // lid = setInterval(frame, 10);
        // let count = 0;
        // function frame() {
        //     if (count >= 10){
        //         count = 0;
        //         clearInterval(lid);
        //     } else {
        //         count++
                
        //     }
        //     rect.style.fill = "rgb(255,255,0)";
        //     rect.style.width += count;
        //     rect.style.height += count;
            // rect.style.fill = "rgb(255,"+count+",0)";
        // }
    }
}

HoldClick = (id) => {
    let rect = svg.querySelector("rect[id='"+id+"']");
    var ind = id.split('|').map(Number);
    if ( (ind[1] != currStart[0][0] || ind[0] != currStart[0][1]) && (ind[1] != currEnd[0][0] || ind[0] != currEnd[0][1]) ){
        if (InsFlag == 0){
            rect.style.fill = wallColor;
            arr[ind[0]][ind[1]] = 1;   //wall
            InsFlag = 0;
        } else if (InsFlag == 1){
            rect.style.fill = "rgb(255,0,0)"; 
            arr[ind[0]][ind[1]] = 2;   //start
            let rev = currStart.pop();
            currStart.unshift([ind[1], ind[0]]);
            InsFlag = 0;
            
            // revert old start 
            rev = rev.reverse().join('|');
            rect = svg.querySelector("rect[id='"+rev+"']");
            var ind = rev.split('|').map(Number);
            rect.style.fill = emptyColor;
            arr[ind[0]][ind[1]] = 0;
        } else if (InsFlag == 2){
            rect.style.fill = "rgb(0,255,0)";
            arr[ind[0]][ind[1]] = 3;   //end
            let rev = currEnd.pop();
            currEnd.unshift([ind[1], ind[0]])
            InsFlag = 0;
            
            // revert old end
            rev = rev.reverse().join('|');
            rect = svg.querySelector("rect[id='"+rev+"']");
            var ind = rev.split('|').map(Number);
            rect.style.fill = emptyColor;
            arr[ind[0]][ind[1]] = 0;
        }
    }
}

var mouseDown = 0;
document.body.onmousedown = function() { 
  mouseDown = 1;
}
document.body.onmouseup = function() {
  mouseDown = 0;
}

startFunct = () => {
    InsFlag = 1;
}

endFunct = () => {
    InsFlag = 2;
}


$("#moveableDiv").draggable({handle: "#header"});

diagFunct = () => {
    diagFlag = 1;
}

nodiagFunct = () => {
    diagFlag = 0;
}



async function findPath() {
    let path = astar_find_path(currStart[0], currEnd[0], arr);
    path.pop();
    path.shift();
    let inc = (100/open_arr.length)
    var val = 70;
    for (let el in open_arr){
        drawUpdate(open_arr[el][1], open_arr[el][0], val);
        await timer(25);
        val += inc;
    }


    for (let step in path){
        let rect = svg.querySelector("rect[id='"+path[step][1]+'|'+path[step][0]+"']");
        rect.style.fill = 'rgb(95,235,95)';
    }
}

var open_arr = [];
                // [x, y] || [c, r]
function astar_find_path(start, end, arr){
    "find the a* path in grid" 
    // console.log("HIT");
    var sol_path = [];
    class ObjectSet extends Set{
        add(elem){
            return super.add(typeof elem === 'object' ? JSON.stringify(elem) : elem);
        }
        has(elem){
            return super.has(typeof elem === 'object' ? JSON.stringify(elem) : elem);
        }
    }
    var g = [];
    g[start] = 0;
    var f = [];
    open_heap = new Heap(function(a, b) {
        return a.num - b.num;
    })
    closed_set = new ObjectSet();
    parent_arr = [];
    let start_heur = Math.sqrt( (end[0]-start[0])**2 + (end[1]-start[1])**2 );
    f[start] = start_heur;
    
    open_heap.push({num: start_heur, loc: start});
    while (open_heap.nodes.length != 0){

        var current = open_heap.pop();
        // console.log(current.loc)
        if (current.loc[0] == end[0] && current.loc[1] == end[1]){
            while (current.loc in parent_arr) {
                sol_path.push(current.loc);
                current = parent_arr[[current.loc]];
            }
            sol_path.push(start);
            return sol_path.reverse();
        }
        closed_set.add(current.loc);

        // search for around for the neighbors
        if (diagFlag == 0){
            nbrs = [[0,1], [-1,0],[1,0], [0,-1]];
        } else {
            //        tl     tm    tr     ml     mr      bl     bm     br
            nbrs = [[-1,1],[0,1],[1,1], [-1,0],[1,0], [-1,-1],[0,-1],[1,-1]];
        }
        for (let nbr in nbrs){
            nbr_x = current.loc[0] + nbrs[nbr][0];
            nbr_y = current.loc[1] + nbrs[nbr][1];
            // exclude out of bounds
            if ( (nbr_x > cols-1) || (nbr_x < 0) || (nbr_y > rows-1) || (nbr_y < 0) ) continue; 
            // do not include obstacles
            if ( arr[nbr_y][nbr_x] == 1 ) continue;
            var heuristic = Math.sqrt( (nbr_x-current.loc[0])**2 + (nbr_y-current.loc[1])**2 );
            var total_g = g[current.loc] + heuristic;
            if ( closed_set.has([nbr_x, nbr_y]) && total_g >= g[[nbr_x, nbr_y]] ) {
                continue;
            }
            var inFlag = 0;
            for (let node in open_heap.nodes) {
                if (open_heap.nodes[node].loc[0] == nbr_x && open_heap.nodes[node].loc[1] == nbr_y) {
                    inFlag = 1;
                    break;
                }
            }
            if (total_g < g[[nbr_x, nbr_y]]) inFlag = 1;
            if (inFlag == 0) {
                parent_arr[[nbr_x, nbr_y]] = current;
                g[[nbr_x,nbr_y]] = total_g;
                // console.log(g);
                heuristic = Math.sqrt( (nbr_x-end[0])**2 + (nbr_y-end[1])**2 );
                // f[nbr_x,nbr_y] = total_g + heuristic;
                open_heap.push( {num: total_g+heuristic, loc: [nbr_x,nbr_y]} );
                
                //draw the open_heap
                if (nbr_x != end[0] || nbr_y != end[1]){
                    open_arr.push([nbr_x, nbr_y]);
                    // drawUpdate(nbr_y, nbr_x);
                    // await timer(100);
                }
            }
        }
    }
}


// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms))

drawUpdate = (nbr_y, nbr_x, gval=95) => {
    let rect = svg.querySelector("rect[id='"+nbr_y+'|'+nbr_x+"']");
    rect.style.fill = 'rgb('+gval+','+gval+','+gval+')';
}



$(document).ready(function(){
    $("#flip").click(function(){
      $("#panel").slideToggle("slow");
    });
});