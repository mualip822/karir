import jobsRepository from '../repositories/jobs.repository'
import type { Job } from '../types/jobs.types'

export class JobsService {
  static async getJobs(): Promise<Job[]> {
    return await jobsRepository.getAll()
  }

  static formatRelativeDate(dateStr: string): string {
    if (!dateStr) return 'Baru saja';

    const now = new Date();
    const then = new Date(dateStr);

    const diffSec = Math.floor((now.getTime() - then.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 10) return 'Baru saja';
    if (diffSec < 60) return `${diffSec} detik lalu`;
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay === 1) return 'Kemarin';
    if (diffDay < 7) return `${diffDay} hari lalu`;
    if (diffWeek < 4) return `${diffWeek} minggu lalu`;
    if (diffMonth < 12) return `${diffMonth} bulan lalu`;

    return `${diffYear} tahun lalu`;
  }

  static formatDeadline(dateStr: string | null): string {
    if (!dateStr) return 'Tidak ada';

    const deadline = new Date(dateStr);
    const now = new Date();

    if (deadline < now) return 'Expired';

    const diffDay = Math.ceil(
      (deadline.getTime() - now.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDay === 0) return 'Berakhir hari ini';
    if (diffDay === 1) return 'Berakhir besok';
    if (diffDay <= 7) return `${diffDay} hari lagi`;
    if (diffDay <= 30) return `${Math.floor(diffDay / 7)} minggu lagi`;

    return deadline.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}