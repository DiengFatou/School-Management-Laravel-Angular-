import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.css'],
  standalone: true,
  imports: [BaseChartDirective]
})
export class DashboardChartsComponent implements OnInit {
  // Graphique de type barres (répartition des élèves par classe)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0A81A2',
        bodyColor: '#1E293B',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const label = context.parsed.y || 0;
            return `${label} élèves`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B' }
      },
      y: {
        grid: { color: 'rgba(10, 129, 162, 0.1)' },
        ticks: { color: '#64748B' },
        beginAtZero: true
      }
    }
  };
  
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Tle'],
    datasets: [
      { 
        data: [45, 42, 48, 46, 52, 49, 47],
        backgroundColor: [
          'rgba(10, 129, 162, 0.7)',
          'rgba(148, 200, 189, 0.7)',
          'rgba(240, 156, 165, 0.7)',
          'rgba(248, 199, 176, 0.7)',
          'rgba(10, 129, 162, 0.5)',
          'rgba(148, 200, 189, 0.5)',
          'rgba(240, 156, 165, 0.5)'
        ],
        borderColor: [
          'rgba(10, 129, 162, 1)',
          'rgba(148, 200, 189, 1)',
          'rgba(240, 156, 165, 1)',
          'rgba(248, 199, 176, 1)',
          'rgba(10, 129, 162, 0.8)',
          'rgba(148, 200, 189, 0.8)',
          'rgba(240, 156, 165, 0.8)'
        ],
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: [
          'rgba(10, 129, 162, 0.9)',
          'rgba(148, 200, 189, 0.9)',
          'rgba(240, 156, 165, 0.9)',
          'rgba(248, 199, 176, 0.9)',
          'rgba(10, 129, 162, 0.7)',
          'rgba(148, 200, 189, 0.7)',
          'rgba(240, 156, 165, 0.7)'
        ]
      }
    ]
  };

  // Graphique circulaire (répartition par genre)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#1E293B',
          padding: 20,
          font: {
            size: 13
          },
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0A81A2',
        bodyColor: '#1E293B',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw as number;
            const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} élèves (${percentage}%)`;
          }
        }
      }
    }
  };
  
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Filles', 'Garçons'],
    datasets: [{
      data: [165, 152],
      backgroundColor: [
        'rgba(240, 156, 165, 0.8)',
        'rgba(10, 129, 162, 0.8)'
      ],
      borderColor: [
        'rgba(240, 156, 165, 1)',
        'rgba(10, 129, 162, 1)'
      ],
      borderWidth: 1,
      hoverOffset: 10
    }]
  };

  // Graphique linéaire (évolution des effectifs sur 6 ans)
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#0A81A2',
        bodyColor: '#1E293B',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B' }
      },
      y: {
        grid: { color: 'rgba(10, 129, 162, 0.1)' },
        ticks: { color: '#64748B' },
        beginAtZero: false
      }
    }
  };
  
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartData<'line'> = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        data: [280, 290, 285, 300, 310, 317],
        label: 'Effectif total',
        borderColor: 'rgba(10, 129, 162, 0.8)',
        backgroundColor: 'rgba(10, 129, 162, 0.1)',
        pointBackgroundColor: 'rgba(10, 129, 162, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(10, 129, 162, 0.8)',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
    // Les données sont statiques pour l'instant, mais pourraient être récupérées depuis un service
  }
}
