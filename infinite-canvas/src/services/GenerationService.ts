/**
 * GenerationRequest - 图像生成请求接口
 * 
 * @interface GenerationRequest
 * @property {string} prompt - 生成提示词，描述想要生成的图像内容
 * @property {number} width - 图像宽度（像素）
 * @property {number} height - 图像高度（像素）
 * @property {number} [seed] - 随机种子，用于生成可复现的结果
 * @property {string} [negativePrompt] - 负面提示词，描述不想要的内容（未来扩展）
 */
export interface GenerationRequest {
    prompt: string;
    width: number;
    height: number;
    seed?: number;
    negativePrompt?: string;
}

/**
 * GenerationResponse - 图像生成响应接口
 * 
 * @interface GenerationResponse
 * @property {string} id - 生成任务的唯一标识符
 * @property {string} url - 生成的图片 URL（Blob URL 或远程 URL）
 * @property {'pending' | 'success' | 'failed'} status - 生成状态
 * @property {any} [metadata] - 额外的元数据（如生成时间、提供者信息等）
 * @property {string} [error] - 错误信息（仅在失败时）
 */
export interface GenerationResponse {
    id: string;
    url: string; // Blob URL or Remote URL
    status: 'pending' | 'success' | 'failed';
    metadata?: any;
    error?: string;
}

/**
 * IGenerationService - 图像生成服务接口
 * 
 * 定义了图像生成服务的标准接口，支持 Mock 实现和真实 API 实现之间的切换
 * 
 * @interface IGenerationService
 */
export interface IGenerationService {
    /**
     * generate - 生成图像
     * 
     * @param {GenerationRequest} req - 生成请求参数
     * @returns {Promise<GenerationResponse>} 生成结果
     */
    generate(req: GenerationRequest): Promise<GenerationResponse>;
}
