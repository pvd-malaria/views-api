import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilerService {
  private context: string;
  private description: string;
  constructor() {}

  start(description: string, context: string) {
    this.context = context;
    this.description = description;
    console.time(`[${this.context}] (${this.description})`);
  }

  end(context?: string) {
    const ctx = context || this.context;
    console.timeEnd(`[${ctx}] (${this.description})`);
  }
}
