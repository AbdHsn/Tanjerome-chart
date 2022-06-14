import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.drawPatientBarChart();
  }

  public patientBarChart: any;
  drawPatientBarChart() {
    this.patientBarChart = new Chart('patientBarChart', {
      type: 'bar',
      data: {
        // labels: model.map((t) =>
        //   this.datePipe.transform(t.CreatedDate, 'dd-MM-yy hh:mm')
        // ),
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Online Quantity',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192, 0.2)',
            //data: model.map((t) => t.CurrentOnline),
            data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],

            borderWidth: 1,
          },
        ],
      },
      options: {
        // tooltips: {
        //   callbacks: {
        //     afterLabel: function (e) {
        //       return 'Vehicle: ' + model[e.index]['Vehicle'];
        //     },
        //   },
        // },
      },
    });
  }
}
