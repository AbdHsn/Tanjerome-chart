import { Component, Input, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ChartData } from 'src/models/patient-records-model';

@Component({
  selector: 'chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
})
export class ChartViewComponent implements OnInit {
  @Input() chartModel: ChartData;

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
        labels: this.chartModel.label,
        datasets: [
          {
            label: 'Online Quantity',
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgb(75, 192, 192, 0.2)',
            //data: model.map((t) => t.CurrentOnline),
            data: this.chartModel.data,

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
