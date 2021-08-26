// Polyfill for replaceAll
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {

    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);

  };
}


function parseInstance(text) {

  function parseProperty(line) {
    const values = line.split(":")
    return {
      "key": values[0].trim().toLowerCase(),
      "value": values[1].trim(),
    }
  }

  function parseNode(line) {
    const values = line.split(" ")
    return {
      "id": parseInt(values[0].trim()),
      "x": parseInt(values[1].trim()),
      "y": parseInt(values[2].trim()),
    }
  }

  function parseDemand(line) {
    const values = line.split(" ")
    return parseInt(values[1].trim());
  }

  let lines = text.replaceAll("\t", " ").split("\r\n");
  let lineNumber = 0;
  let instance = {
    "property": {},
    "nodes": [],
  }

  while (lineNumber < lines.length) {
    if (lines[lineNumber].includes(":")) {
      const prop = parseProperty(lines[lineNumber]);
      if (prop.key == "dimension" || prop.key == "capacity") {
        prop.value = parseInt(prop.value);
      }
      instance.property[prop.key] = prop.value;
      lineNumber++;
    } else if (lines[lineNumber].startsWith("NODE_COORD_SECTION")) {
      lineNumber++;
      for (let i = 0; i < instance.property.dimension; i++) {
        instance.nodes.push(parseNode(lines[lineNumber]));
        lineNumber++;
      }
    } else if (lines[lineNumber].startsWith("DEMAND_SECTION")) {
      lineNumber++;
      for (let i = 0; i < instance.property.dimension; i++) {
        instance.nodes[i]["demand"] = parseDemand(lines[lineNumber]);
        lineNumber++;
      }
    } else {
      lineNumber++
    }
  }
  return instance;
}

export async function fetchInstance(instanceName) {

  if (instances.includes(instanceName)) {
    let filename = `${instanceName}.vrp`;

    let instance = await fetch(`instances/${filename}`)
      .then(response => response.text())
      .then(text => parseInstance(text));
    instance.bks = BKS[instanceName];
    return instance;
  }
}

function parseSolution(text) {
  let lines = text.replaceAll("\t", " ").split("\n");
  let solution = {
    routes: [],
    cost: undefined,
  }

  lines.forEach(line => {
    if (line.startsWith("Route")) {
      let route = [];
      const stops = line.split(":");
      stops[1].trim().split(" ").forEach(stop => {
        route.push(parseInt(stop));
      });
      solution.routes.push(route);
    } else if (line.startsWith("Cost")) {
      solution.cost = parseInt(line.split(" ")[1]);
    }
  });

  return solution;
}

export function fetchSolution(instance) {

  if (instances.includes(instance)) {
    let filename = `${instance}.sol`;

    return fetch(`instances/${filename}`)
      .then(response => response.text())
      .then(text => parseSolution(text));
  }
}

export const instances = [
  "X-n101-k25",
  "X-n106-k14",
  "X-n110-k13",
  "X-n115-k10",
  "X-n120-k6",
  "X-n125-k30",
  "X-n129-k18",
  "X-n134-k13",
  "X-n139-k10",
  "X-n143-k7",
  "X-n148-k46",
  "X-n153-k22",
  "X-n157-k13",
  "X-n162-k11",
  "X-n167-k10",
  "X-n172-k51",
  "X-n176-k26",
  "X-n181-k23",
  "X-n186-k15",
  "X-n190-k8",
  "X-n195-k51",
  "X-n200-k36",
  "X-n204-k19",
  "X-n209-k16",
  "X-n214-k11",
  "X-n219-k73",
  "X-n223-k34",
  "X-n228-k23",
  "X-n233-k16",
  "X-n237-k14",
  "X-n242-k48",
  "X-n247-k50",
  "X-n251-k28",
  "X-n256-k16",
  "X-n261-k13",
  "X-n266-k58",
  "X-n270-k35",
  "X-n275-k28",
  "X-n280-k17",
  "X-n284-k15",
  "X-n289-k60",
  "X-n294-k50",
  "X-n298-k31",
  "X-n303-k21",
  "X-n308-k13",
  "X-n313-k71",
  "X-n317-k53",
  "X-n322-k28",
  "X-n327-k20",
  "X-n331-k15",
  "X-n336-k84",
  "X-n344-k43",
  "X-n351-k40",
  "X-n359-k29",
  "X-n367-k17",
  "X-n376-k94",
  "X-n384-k52",
  "X-n393-k38",
  "X-n401-k29",
  "X-n411-k19",
  "X-n420-k130",
  "X-n429-k61",
  "X-n439-k37",
  "X-n449-k29",
  "X-n459-k26",
  "X-n469-k138",
  "X-n480-k70",
  "X-n491-k59",
  "X-n502-k39",
  "X-n513-k21",
  "X-n524-k153",
  "X-n536-k96",
  "X-n548-k50",
  "X-n561-k42",
  "X-n573-k30",
  "X-n586-k159",
  "X-n599-k92",
  "X-n613-k62",
  "X-n627-k43",
  "X-n641-k35",
  "X-n655-k131",
  "X-n670-k130",
  "X-n685-k75",
  "X-n701-k44",
  "X-n716-k35",
  "X-n733-k159",
  "X-n749-k98",
  "X-n766-k71",
  "X-n783-k48",
  "X-n801-k40",
  "X-n819-k171",
  "X-n837-k142",
  "X-n856-k95",
  "X-n876-k59",
  "X-n895-k37",
  "X-n916-k207",
  "X-n936-k151",
  "X-n957-k87",
  "X-n979-k58",
  "X-n1001-k43",
];

const BKS = {
  "X-n101-k25": 27591,
  "X-n106-k14": 26362,
  "X-n110-k13": 14971,
  "X-n115-k10": 12747,
  "X-n120-k6": 13332,
  "X-n125-k30": 55539,
  "X-n129-k18": 28940,
  "X-n134-k13": 10916,
  "X-n139-k10": 13590,
  "X-n143-k7": 15700,
  "X-n148-k46": 43448,
  "X-n153-k22": 21220,
  "X-n157-k13": 16876,
  "X-n162-k11": 14138,
  "X-n167-k10": 20557,
  "X-n172-k51": 45607,
  "X-n176-k26": 47812,
  "X-n181-k23": 25569,
  "X-n186-k15": 24145,
  "X-n190-k8": 16980,
  "X-n195-k51": 44225,
  "X-n200-k36": 58578,
  "X-n204-k19": 19565,
  "X-n209-k16": 30656,
  "X-n214-k11": 10856,
  "X-n219-k73": 117595,
  "X-n223-k34": 40437,
  "X-n228-k23": 25742,
  "X-n233-k16": 19230,
  "X-n237-k14": 27042,
  "X-n242-k48": 82751,
  "X-n247-k50": 37274,
  "X-n251-k28": 38684,
  "X-n256-k16": 18839,
  "X-n261-k13": 26558,
  "X-n266-k58": 75478,
  "X-n270-k35": 35291,
  "X-n275-k28": 21245,
  "X-n280-k17": 33503,
  "X-n284-k15": 20215,
  "X-n289-k60": 95151,
  "X-n294-k50": 47161,
  "X-n298-k31": 34231,
  "X-n303-k21": 21736,
  "X-n308-k13": 25859,
  "X-n313-k71": 94043,
  "X-n317-k53": 78355,
  "X-n322-k28": 29834,
  "X-n327-k20": 27532,
  "X-n331-k15": 31102,
  "X-n336-k84": 139111,
  "X-n344-k43": 42050,
  "X-n351-k40": 25896,
  "X-n359-k29": 51505,
  "X-n367-k17": 22814,
  "X-n376-k94": 147713,
  "X-n384-k52": 65928,
  "X-n393-k38": 38260,
  "X-n401-k29": 66154,
  "X-n411-k19": 19712,
  "X-n420-k130": 107798,
  "X-n429-k61": 65449,
  "X-n439-k37": 36391,
  "X-n449-k29": 55233,
  "X-n459-k26": 24139,
  "X-n469-k138": 221824,
  "X-n480-k70": 89449,
  "X-n491-k59": 66483,
  "X-n502-k39": 69226,
  "X-n513-k21": 24201,
  "X-n524-k153": 154593,
  "X-n536-k96": 94846,
  "X-n548-k50": 86700,
  "X-n561-k42": 42717,
  "X-n573-k30": 50673,
  "X-n586-k159": 190316,
  "X-n599-k92": 108451,
  "X-n613-k62": 59535,
  "X-n627-k43": 62164,
  "X-n641-k35": 63682,
  "X-n655-k131": 106780,
  "X-n670-k130": 146332,
  "X-n685-k75": 68205,
  "X-n701-k44": 81923,
  "X-n716-k35": 43373,
  "X-n733-k159": 136187,
  "X-n749-k98": 77269,
  "X-n766-k71": 114417,
  "X-n783-k48": 72386,
  "X-n801-k40": 73305,
  "X-n819-k171": 158121,
  "X-n837-k142": 193737,
  "X-n856-k95": 88965,
  "X-n876-k59": 99299,
  "X-n895-k37": 53860,
  "X-n916-k207": 329179,
  "X-n936-k151": 132715,
  "X-n957-k87": 85465,
  "X-n979-k58": 118976,
  "X-n1001-k43": 72355,
};