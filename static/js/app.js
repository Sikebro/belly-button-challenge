

// Using D3 library to read in samples.json
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Horizontal Bar chart displaying the top 10 OTUs
function HorizontalBar (sampleData) {

    console.log(`HorizontalBar(${sampleData})`);
    //fetching JSON data and console log it
    d3.json(url).then(OtuData => {
        console.log(OtuData)
        
        let sample = OtuData.samples;
        // filtering out the id from the dataset
        let array = sample.filter(s => s.id == sampleData);
        let results = array[0];
    
        // retrieving otu data from the dataset and declare to correspoding variable
        let otuID = results.otu_ids;
        let otuLabels = results.otu_labels;
        let sampleValues = results.sample_values;
    
        //lets create the ytick data
        yticks = otuID.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    
        //creating our horizontal bar graph trace
        let barGraph =  {
            x: sampleValues.slice(0,10).reverse(),
            y: yticks,
            type: 'bar',
            text: otuLabels.slice(0,10).reverse(),
            orientation: 'h'
        };
    
        let graphArray = [barGraph];
        //creat the layout 
        let layout = {
            title: "Top 10-OTUs",
            margin: {t: 25, l: 125}
        };
        //displaying the graph 
        Plotly.newPlot('bar', graphArray, layout);
    
    });

}
//function for creating bubble chart
function bubbleChart(sampleData){

    d3.json(url).then(bubbleData => {
        let sample = bubbleData.samples;
        // filtering out the id from the dataset
        let array = sample.filter(s => s.id == sampleData);
        let results = array[0];
    
        // retrieving otu data from the dataset and declare to correspoding variable
        let otuID = results.otu_ids;
        let otuLabels = results.out_labels;
        let sampleValues = results.sample_values; 

        // lets create the trace for the bubble chart
        let bubble = {
            x: otuID,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuID,
                colorscale: 'Portland'
            }
        }
        //load the data into the bubble array
        let bubbleArray = [bubble];
        //create the layout
        let layout = {
            title: 'Bacteria Cultures Per Unique Sample',
            margin: {t: 30},
            hovermode: 'closest',
            xaxis: {title: "OTU ID"},
        }
        //display the graph 
        Plotly.newPlot('bubble', bubbleArray, layout);
    })
}
//function to show the metadata
function metaData(sampleData){
    d3.json(url).then((data) => {
        let meta = data.metadata;
        
        let results = meta.filter(meta => meta.id == sampleData)[0];
        let demoInfo = d3.select('#sample-metadata');

        demoInfo.html('');
        Object.entries(results).forEach(([key, value]) => {
            demoInfo.append('h6').text(`${key}: ${value}`);
        });
    })
}
//function to allow for the data to be updated after changing to new ID
function optionChanged(sampleData) {
    console.log(`optionChanged, new value: ${sampleData}`);

    HorizontalBar(sampleData);
    bubbleChart(sampleData);
    metaData(sampleData);
}

function Init() {
    // Get a handle to the dropdown
    let selector = d3.select('#selDataset');

    d3.json(url).then(data => {

        let currentName = data.names;
        // Populate the dropdown with for loop
        for (let i = 0; i < currentName.length; i++) {
            let sampleData = currentName[i];
            selector.append('option').text(sampleData).property('value', sampleData);
        };

        // Read the current value from the dropdown
        let currentId = selector.property('value');
        console.log(`currentId = ${currentId}`);

        // dispaly bar graph, bubble chart, and metadata
        HorizontalBar(currentId);
        bubbleChart(currentId);
        metaData(currentId);

    });

}

Init();