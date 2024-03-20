import { registerOTel } from '@vercel/otel'
 
export function register() {
  registerOTel({ serviceName: 'metatronicsmind-ai-translator' })
}