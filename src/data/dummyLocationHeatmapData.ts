export interface LocationHeatmapData {
    id:string,
    name:string,
    incidents:string,
    priority:'high' | 'medium' | 'low',
}

export const dummyHeamMapData: LocationHeatmapData[] = [
    {
        id: "4534fdgzcxvasf",
        name: "Building 1",
        incidents: "21",
        priority: "high",
    },
    {
        id: "a7d9fg8asfdf32",
        name: "Building 2",
        incidents: "14",
        priority: "medium",
    },
    {
        id: "9df8as7df8asf0",
        name: "Building 3",
        incidents: "30",
        priority: "high",
    },
    {
        id: "234fa9sd87f9sd",
        name: "Building 4",
        incidents: "7",
        priority: "low",
    },
    {
        id: "kdfj9283fsdf98",
        name: "Building 5",
        incidents: "18",
        priority: "high",
    },
    {
        id: "zxv9234dfg23ad",
        name: "Building 6",
        incidents: "25",
        priority: "medium",
    },
];