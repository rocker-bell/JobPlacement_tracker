// import React, { useEffect, useState } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client";
// import Chart from "chart.js/auto";
// import "../Styles/CandidatureMap.css"

// const CandidatureMap = () => {
//   const [citiesData, setCitiesData] = useState([]);
//   const [chartInstance, setChartInstance] = useState(null);

//   // Fetch candidature counts per city
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await fetch("http://localhost:8000/FetchStagesBycandidatures.php");
//         const data = await res.json();
//         if (data.success) {
//           setCitiesData(data.data);
//         }
//       } catch (err) {
//         console.error("Failed to fetch candidature data:", err);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (citiesData.length === 0) return;

//     const width = 600;
//     const height = 600;

//     // Remove old SVG if exists
//     d3.select(".map").select("svg").remove();

//     const svg = d3.select(".map")
//                   .append("svg")
//                   .attr("width", width)
//                   .attr("height", height);

//     const g = svg.append("g");

//     const projection = d3.geoMercator()
//                          .center([-7, 31])
//                          .scale(2000)
//                          .translate([width / 2, height / 2]);

//     const path = d3.geoPath().projection(projection);

//     // Moroccan cities with coordinates
//     const citiesCoords = [
//       { name: "Casablanca", lon: -7.5898, lat: 33.5731 },
//       { name: "Rabat", lon: -6.8498, lat: 34.0209 },
//       { name: "Marrakesh", lon: -7.9811, lat: 31.6340 },
//       { name: "Fes", lon: -4.999, lat: 34.0331 },
//       { name: "Tangier", lon: -5.812, lat: 35.7595 }
//     ];

//     // Merge citiesCoords with fetched data
//     const cities = citiesCoords.map(c => {
//       const found = citiesData.find(d => d.city === c.name);
//       return { ...c, value: found ? found.candidatures : 0 };
//     });

//     // Load world TopoJSON and draw Morocco
//     d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
//       .then(data => {
//         const countries = topojson.feature(data, data.objects.countries).features;
//         const morocco = countries.filter(d => d.id === "504");

//         // Draw Morocco
//         g.selectAll('path')
//          .data(morocco)
//          .enter()
//          .append('path')
//          .attr('class', 'country')
//          .attr('fill', 'lightgreen')
//          .attr('stroke', 'black')
//          .attr('stroke-width', 1)
//          .attr('d', path);

//         // Draw cities
//         g.selectAll('circle')
//          .data(cities)
//          .enter()
//          .append('circle')
//          .attr('class', 'city-circle')
//          .attr('cx', d => projection([d.lon, d.lat])[0])
//          .attr('cy', d => projection([d.lon, d.lat])[1])
//          .attr('r', d => Math.max(d.value, 3)) // radius proportional to candidature count
//          .attr('fill', 'red')
//          .attr('stroke', 'black')
//          .attr('stroke-width', 1)
//          .on('mouseover', function(event, d) {
//            d3.select(this).attr('r', Math.max(d.value, 3) + 5);
//          })
//          .on('mouseout', function(event, d) {
//            d3.select(this).attr('r', Math.max(d.value, 3));
//          })
//          .append("title") // tooltip
//          .text(d => `${d.name}: ${d.value} candidatures`);
//       });

//     // Draw Chart.js bar chart
//     const ctx = document.getElementById('cityChart').getContext('2d');
//     if (chartInstance) {
//       chartInstance.destroy(); // remove old chart
//     }
//     const newChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: cities.map(c => c.name),
//         datasets: [{
//           label: 'Candidatures',
//           data: cities.map(c => c.value),
//           backgroundColor: ['#4caf50','#2196f3','#ff9800','#e91e63','#9c27b0']
//         }]
//       },
//       options: {
//         responsive: true,
//         plugins: { legend: { display: false } },
//         scales: {
//           y: { beginAtZero: true }
//         }
//       }
//     });
//     setChartInstance(newChart);

//   }, [citiesData]);

//   return (
//     <div className="map-statistiques" >
//       <div className="map" style={{ width: 600, height: 600, border: '1px solid black', backgroundColor: 'white' }}></div>
//       <canvas id="cityChart" style={{ marginTop: 20, maxWidth: 600 }}></canvas>
//     </div>
//   );
// };

// export default CandidatureMap;


import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import Chart from "chart.js/auto";
import "../Styles/CandidatureMap.css";

const CandidatureMap = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);

  // Fetch candidature counts per city
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:8000/FetchStagesBycandidatures.php");
        const data = await res.json();
        if (data.success) {
          setCitiesData(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch candidature data:", err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (citiesData.length === 0) return;

    const width = 600;
    const height = 600;

    // Remove old SVG if exists
    d3.select(".map").select("svg").remove();

    const svg = d3.select(".map")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    const g = svg.append("g");

    const projection = d3.geoMercator()
                         .center([-7, 31])
                         .scale(2000)
                         .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Moroccan cities with coordinates
    const citiesCoords = [
      { name: "Casablanca", lon: -7.5898, lat: 33.5731 },
      { name: "Rabat", lon: -6.8498, lat: 34.0209 },
      { name: "Marrakesh", lon: -7.9811, lat: 31.6340 },
      { name: "Fes", lon: -4.999, lat: 34.0331 },
      { name: "Tangier", lon: -5.812, lat: 35.7595 }
    ];

    // Merge citiesCoords with fetched data
    const cities = citiesCoords.map(c => {
      const found = citiesData.find(d => d.city === c.name);
      return { ...c, value: found ? found.candidatures : 0 };
    });

    // Load world TopoJSON and draw Morocco
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json')
      .then(data => {
        const countries = topojson.feature(data, data.objects.countries).features;
        const morocco = countries.filter(d => d.id === "504");

        // Draw Morocco
        g.selectAll('path')
         .data(morocco)
         .enter()
         .append('path')
         .attr('class', 'country')
         .attr('fill', 'lightgreen')
         .attr('stroke', 'black')
         .attr('stroke-width', 1)
         .attr('d', path);

        // Draw cities with hover labels
        g.selectAll('circle')
         .data(cities)
         .enter()
         .append('circle')
         .attr('class', 'city-circle')
         .attr('cx', d => projection([d.lon, d.lat])[0])
         .attr('cy', d => projection([d.lon, d.lat])[1])
         .attr('r', d => Math.max(d.value, 3)) // radius proportional to candidature count
         .attr('fill', 'red')
         .attr('stroke', 'black')
         .attr('stroke-width', 1)
         .on('mouseover', function(event, d) {
           d3.select(this).attr('r', Math.max(d.value, 3) + 5);

           // Add city name label
           g.append('text')
             .attr('id', 'city-label')
             .attr('x', projection([d.lon, d.lat])[0] + 10)
             .attr('y', projection([d.lon, d.lat])[1] - 10)
             .text(d.name)
             .attr('font-size', '14px')
             .attr('font-weight', 'bold')
             .attr('fill', 'black');
         })
         .on('mouseout', function(event, d) {
           d3.select(this).attr('r', Math.max(d.value, 3));
           g.select('#city-label').remove(); // remove label
         });
      });

    // Draw Chart.js bar chart
    const ctx = document.getElementById('cityChart').getContext('2d');
    if (chartInstance) {
      chartInstance.destroy(); // remove old chart
    }
    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: cities.map(c => c.name),
        datasets: [{
          label: 'Candidatures',
          data: cities.map(c => c.value),
          backgroundColor: ['#4caf50','#2196f3','#ff9800','#e91e63','#9c27b0']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
    setChartInstance(newChart);

  }, [citiesData]);

  return (
    <div className="map-statistiques">
      <div className="map" style={{ width: 600, height: 600, border: '1px solid black', backgroundColor: 'white' }}></div>
      <canvas id="cityChart" style={{ marginTop: 20, maxWidth: 600 }}></canvas>
    </div>
  );
};

export default CandidatureMap;
