import type { GenerationRequest, GenerationResponse, IGenerationService } from './GenerationService';
import { nanoid } from 'nanoid';

/**
 * MockGenerationService - Mock 图像生成服务
 * 
 * 用于开发和测试阶段，模拟真实的 AI 图像生成 API：
 * - 模拟网络延迟（2-5秒随机延迟）
 * - 返回占位图片（使用 Lorem Picsum API）
 * - 支持不同的尺寸和随机种子
 * 
 * 未来可以轻松替换为真实的 AI API 服务（如 Stable Diffusion、Midjourney）
 * 
 * @implements {IGenerationService}
 */
export class MockGenerationService implements IGenerationService {
    /**
     * generate - 模拟图像生成
     * 
     * @param {GenerationRequest} req - 生成请求参数
     * @returns {Promise<GenerationResponse>} 包含占位图片 URL 的响应
     */
    async generate(req: GenerationRequest): Promise<GenerationResponse> {
        console.log('[MockService] Generating image for:', req);

        // Simulate network latency (2-5 seconds)
        const delay = 2000 + Math.random() * 3000;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Simulate failure randomly (optional, maybe 5% chance)
        // if (Math.random() < 0.05) {
        //   return {
        //     id: nanoid(),
        //     url: '',
        //     status: 'failed',
        //     error: 'Mock generation failed randomly'
        //   };
        // }

        // Return a placeholder image
        // Using picsum.photos for variety based on seed or random
        const seed = req.seed ?? Math.floor(Math.random() * 1000);
        const url = `https://picsum.photos/seed/${seed}/${Math.floor(req.width)}/${Math.floor(req.height)}`;

        return {
            id: nanoid(),
            url: url,
            status: 'success',
            metadata: {
                provider: 'mock',
                duration: delay
            }
        };
    }
}
