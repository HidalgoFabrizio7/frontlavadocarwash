import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ChartConfiguration, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService, TiempoProcesoDTO } from '../../services/dashboard.service';

const COLOR_PRIMARY = '#43a047';
const COLOR_SECONDARY = '#1976d2';
const COLOR_ACCENT = '#b2ff59';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  ingresos = 0;
  serviciosEnCola = 0;
  tiempoProceso: TiempoProcesoDTO[] = [];

  lineChartData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Servicios', borderColor: COLOR_SECONDARY, backgroundColor: COLOR_SECONDARY }] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = { responsive: true };

  topMuebleChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Top Muebles', backgroundColor: COLOR_PRIMARY }] };
  topClienteChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Top Clientes', backgroundColor: COLOR_ACCENT }] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = { responsive: true };

  constructor(private dashS: DashboardService) { }

  ngOnInit(): void {
    this.dashS.getIngresos().subscribe(data => this.ingresos = data.total);
    this.dashS.getServiciosEnCola().subscribe(data => this.serviciosEnCola = data);

    this.dashS.getFlujoServicios().subscribe(data => {
      this.lineChartData = {
        labels: data.map(d => d.fecha),
        datasets: [{ data: data.map(d => d.cantidad), label: 'Servicios', borderColor: COLOR_SECONDARY, backgroundColor: COLOR_SECONDARY }]
      };
    });

    this.dashS.getTopMueble().subscribe(data => {
      this.topMuebleChartData = {
        labels: data.map(d => d.descripcion),
        datasets: [{ data: data.map(d => d.cantidad), label: 'Top Muebles', backgroundColor: COLOR_PRIMARY }]
      };
    });

    this.dashS.getTopCliente().subscribe(data => {
      this.topClienteChartData = {
        labels: data.map(d => `${d.nombreCliente} ${d.apellidoClientes}`),
        datasets: [{ data: data.map(d => d.cantidad), label: 'Top Clientes', backgroundColor: COLOR_ACCENT }]
      };
    });

    this.dashS.getTiempoProceso().subscribe(data => this.tiempoProceso = data);
  }
}
