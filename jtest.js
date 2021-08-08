

let rows = 100;
let cols = 100;
var arr = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

                // [x, y] || [c, r]
astar_find_path = (start, end, arr) => {
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
                sol_path.push(current.loc)
                current = parent_arr[[current.loc]]
            }
            sol_path.push(start)
            return sol_path.reverse();
        }
        closed_set.add(current.loc)

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
            }
            // return;
        }
    }
}
                

