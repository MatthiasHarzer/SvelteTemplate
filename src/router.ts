import { readable, writable } from 'svelte/store';

let currentURL;

const getUrlWithParam = (param, value) => {
    const route = window.location.href.split("?")[1];
    let newRoute = window.location.origin + "/?";
    if (route && route.includes("=")) {
        const params = getParams(route);
        for (let p in params) {
            if (p == param && (param && value)) {
                newRoute += `${param}=${value}&`;
            } else {
                newRoute += `${p}=${params[p]}&`;
            }
        }
        if (!Object.keys(params).includes(param) && (param && value)) {
            newRoute += `${param}=${value}&`;
        }
    } else if (param && value) {
        newRoute += `${param}=${value}&`;
    }
    if (newRoute[newRoute.length - 1] == "&") {
        newRoute = newRoute.substring(0, newRoute.length - 1);
    }
    return newRoute;
}
const getParams = (route) => {
    let params = {};
    for (let pair of route.split("&")) {

        pair = pair.split("=");

        if (pair.length >= 2 && pair[0].length > 0) {
            params[pair[0]] = pair[1];
        }
    }
    return params;
}

const createRoute = () => {
    const { subscribe, set } = writable("/");
    let parameters = window.location.href.split("?")[1];
    let route = "/";
    if (parameters && parameters.includes("=")) {
        const params = getParams(parameters);
        if (params['r']) {
            route = params['r']
            set(params['r'])
        }
    }

    currentURL = getUrlWithParam(null, null);

    //Phone backbutton event
    window.addEventListener('popstate', function (event) {
        // alert("change")
        let parameters = window.location.href.split("?")[1];

        if (parameters && parameters.includes("=")) {
            const params = getParams(parameters);
            if (params['r']) {
                route = params['r']

                set(params['r'])
            }
        } else {
            route = "/"
            set("/")
        }
        onUpdate();
    });


    let callbacks = [];
    const onUpdate = async () => {
        for (let cb of callbacks) {
            const { route, callback, rem, active } = cb;
            // console.log(route, rem, active)
            if (routeIs(route)) {
                callback(true);
                cb.active = true;


            } else {
                if (active && rem) {


                    callback(false);
                }
                cb.active = false;
            }
        }

    }

    const routeIs = (param = "") => {
        let params = param.split("/").filter(ri => ri.length > 0);

        let current_route = route.split("/").filter(ri => ri.length > 0);

        // console.log(params, current_route, route)

        let strict = true;

        let valid = current_route.length > 0;

        if (params.length === params.filter(pi => pi === "*").length) {
            return true;
        }


        //*Split params in groups: */abc/cde/*/xyz/.. -> [ ['abc', 'cde'], ['xyz'] ]
        let groups = [];
        let cg = [];
        for (let new_param of params) {
            if (new_param === "*" && cg.length > 0) {
                groups.push([...cg]);
                cg = [];
            } else if (new_param !== "*") {
                cg.push(new_param)
            }
        }
        if (cg.length > 0) {
            groups.push([...cg]);
        }
        //?-> there should be a smarter way.... .split("*") or smthlt wd work i guess 🤔


        let first_strict = params[0] !== "*"; //*Check if first param must be first current_route param
        // let last_group_endpoit = 0;
        // let used_indexes = []

        // console.log(groups)

        //*Check if every group in the groups order is presend in the current_route
        for (let groups_index = 0; groups_index < groups.length; groups_index++) {
            let group = groups[groups_index];
            let first_item = group[0];  //*Used to determine the indexes in current_route of the first elemnt in group, to check group relative correct
            let first_item_indexes = [];//*Bit useless: if more than one key of the first itme was found in current_route

            //* If first group and strict (nothing infront), invalidate if first items don't match
            if (groups_index == 0) {
                if (first_strict) {
                    if (first_item[0] == "{" && first_item[first_item.length - 1] == "}") {
                        // console.log(first_item, first_item.substring(1, first_item.length - 1), current_route[0].split(":")[0], first_item.substring(1, first_item.length - 1) === current_route[0].split(":")[0])
                        valid = first_item.substring(1, first_item.length - 1) === current_route[0].split(":")[0]
                    } else {

                        valid = first_item === current_route[0]
                    }
                }
            }


            //* Get indexes of first item in group in current_route ({}=dynamic item)
            if (first_item[0] == "{" && first_item[first_item.length - 1] == "}") {
                let d_item = first_item.substring(1, first_item.length - 1)

                for (let crsi = 0; crsi < current_route.length; crsi++) {
                    let crs = current_route[crsi]
                    // console.log(crsi, crs)
                    if (crs.split(":")[0] === d_item) {
                        first_item_indexes.push(crsi)
                    }
                }


            } else {
                let cri_i = 0;
                let criop_known = []
                first_item_indexes = current_route.map(cri => current_route.indexOf(first_item, cri_i++)).filter(item => {
                    if (item >= 0 && !criop_known.includes(item)) {
                        criop_known.push(item);
                        return true;
                    } else { return false }
                }); // Get all occurences indexes of group[0] in current_route

            }

            let any_success = false;
            //* Check if the group occures in current_route, depending on entrypoint firs_item_index
            for (let first_item_index of first_item_indexes) {
                // console.log(group, first_item_index)
                let v = true;
                for (let group_item_index = 0; group_item_index < group.length; group_item_index++) {
                    let item = group[group_item_index];

                    if (item[0] == "{" && item[item.length - 1] == "}") {
                        item = item.substring(1, item.length - 1)

                        try {
                            // console.log(`${current_route[first_item_index + group_item_index].split(":")[0]} !== ${item}: ${current_route[first_item_index + group_item_index].split(":")[0] !== item}`)
                            if (current_route[first_item_index + group_item_index].split(":")[0] !== item) {
                                v = false;
                            }
                        } catch {
                            v = false;
                        }
                    } else {


                        try {
                            // console.log(`${current_route[first_item_index + group_item_index]} !== ${item}: ${current_route[first_item_index + group_item_index] !== item}`)
                            if (current_route[first_item_index + group_item_index] !== item) {
                                v = false;
                            }
                        } catch {
                            v = false;
                        }

                    }
                }
                // @ts-ignore
                any_success |= v; //*It's enough if one succeded
            }
            // console.log(valid, any_success)

            valid = valid && any_success;

        }
        return valid;
    }

    const dynamicTemplateItem = (item) => {
        if (item[0] == "{" && item[item.length - 1] == "}") {
            return item.substring(1, item.length - 1)
        }
        return item
    }

    const add_ = (route_or_item, item_value = null) =>{
        route_or_item = item_value !== null ? `${route_or_item}:${item_value}` : route_or_item
        let or = route.split("/");
        let l = route_or_item.split("/").length;
        route_or_item = route_or_item.split("/")

        // console.log(or, '->')
        let change = false;
        for (let routepart of or) {  //Check route if anything known
            if (route_or_item.includes(routepart) && routepart.length > 0) {    //if smth known, replay following with all from r
                let index = or.indexOf(routepart);                  //ex: route=/plate/abc/overview, r=/plate/xyz -> /plate/xyz/overview
                // console.log(routepart)
                for (let i = 0; i < l; i++) {
                    try {
                        or[index + i] = route_or_item[i]

                    } catch { }

                }
                change = true;
                break;
            }
        }
        if (!change) {
            or = [...or, ...route_or_item];
        }
        or = or.filter(e => e.length > 0)
        // console.log(or)
        route = or.length > 0 ? "/" + or.join("/") : "/";
        history.pushState({}, null, getUrlWithParam("r", route));
        set(route);
        onUpdate();
    }
    const remove_ = (item_or_route, replace_history = false) =>{
        let current_route = route.split("/").filter(ri => ri.length > 0);
        let to_remove = item_or_route.split("/").filter(ri => ri.length > 0);

        let cr_copy = [...current_route]
        if (cr_copy.length > 0) {
            for (let cri = cr_copy.length - 1; cri >= 0; cri--) {
                let cr = cr_copy[cri]

                for (let tr of to_remove) {
                    tr = dynamicTemplateItem(tr);
                    // console.log(cr, cr.split(":")[0], tr, cr.split(":")[0] === tr)

                    if (cr === tr || cr.split(":")[0] === tr) {
                        current_route.splice(cri, 1);
                    }
                }
            }
        }
        route = current_route.length > 0 ? "/" + current_route.join("/") : "/";
        if (replace_history) {
            history.replaceState({}, null, getUrlWithParam("r", route))
        } else {
            history.pushState({}, null, getUrlWithParam("r", route));
        }
        set(route);
        onUpdate();
        return;

    }

    return {
        subscribe,
        is: (route = "") => routeIs(route),
        on: (route, callback, include_onremove = false) => {
            callbacks.push({ route: route, callback: callback, rem: include_onremove, active: false });
            onUpdate();
        },
        set: (r, replace_history = false) => {


            if (replace_history) {
                history.replaceState({}, null, getUrlWithParam("r", r))
            } else {
                history.pushState({}, null, getUrlWithParam("r", r));
            }
            route = r;
            set(r);
            onUpdate();
        },
        add: add_,
        setItem: (item, value, replace_history = false) => {
            let current_route = route.split("/").filter(ri => ri.length > 0);

            let includes = false;
            let include_index = 0;
            if (current_route.length > 0) {
                for (let cri = 0; cri < current_route.length; cri++) {
                    let cr = current_route[cri]
                    try {
                        if (cr.split(":")[0] == item) {
                            includes = true;
                            include_index = cri;
                            break;
                        }
                    } catch { }
                }
            }
            if (includes) {
                current_route[include_index] = `${item}:${value}`;
            } else {
                current_route.push(`${item}:${value}`)
            }

            route = current_route.length > 0 ? "/" + current_route.join("/") : "/";
            if (replace_history) {
                history.replaceState({}, null, getUrlWithParam("r", route))
            } else {
                history.pushState({}, null, getUrlWithParam("r", route));
            }

            set(route);
            onUpdate();


        },
        get: item => {
            let current_route = route.split("/").filter(ri => ri.length > 0);

            if (current_route.length > 0) {
                for (let cr of current_route) {
                    try {
                        if (cr.split(":")[0] == item) {
                            return cr.split(":")[1]
                        }
                    } catch { }
                }
            }
            return false;

        },
        remove: remove_,
        includes_: (item) => {
            // let w = writable();
            // $route
            return route.split("/").includes(item.toLowerCase());
        },
        getDynamicItem: (key) => {
            let s = route.split("/");
            if (s.includes(key)) {
                try {
                    return s[s.indexOf(key) + 1];
                } catch { }

            }
            return null;
        },
        toggle: item=>{
            if(routeIs(`*/${item}/*`)){
                console.log("includes", item)
                remove_(item);
            }else{
                console.log("not includes", item)
                add_(item)
            }
        }
    }



}
export const route = createRoute();
