import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camera',
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css'
})
export class CameraComponent implements OnInit {
  @ViewChild('video',   { static: true }) videoRef!:   ElementRef<HTMLVideoElement>;
  @ViewChild('canvas',  { static: true }) canvasRef!:  ElementRef<HTMLCanvasElement>;

  photo: string | null = null;
  private stream!: MediaStream;

  async ngOnInit() {
    try {
      // Solicita acceso a la cámara
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Error accediendo a la cámara:', err);
      alert('No fue posible acceder a la cámara.');
    }
  }

  capture() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d')!;

    // Ajusta el tamaño del canvas al del video
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dibuja el fotograma actual en el canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convierte a data URL (base64) y lo asigna a la propiedad photo
    this.photo = canvas.toDataURL('image/png');
  }

  // Opcional: detener la cámara al destruir el componente
  ngOnDestroy() {
    this.stream?.getTracks().forEach(track => track.stop());
  }
}
