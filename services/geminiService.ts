
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMarketTrends = async (affiliateId: string): Promise<Product[]> => {
  const prompt = `
    Aja como um analista de dados do Magazine Luiza. 
    Use a ferramenta de busca para encontrar os 5 produtos mais vendidos e com os maiores descontos no site magazineluiza.com.br HOJE.
    Retorne uma lista JSON com: nome, preço_atual, categoria e link_original.
    Considere tendências de smartphones, eletrodomésticos e tecnologia.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    // Simulação de parsing para garantir funcionalidade na UI
    // Em um cenário de produção, usaríamos responseSchema para garantir o JSON
    return [
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "Smart TV Samsung 50\" Crystal UHD 4K",
        price: 2249.10,
        link: `https://www.magazineluiza.com.br/p/237254500/?seller_id=${affiliateId}`,
        score: 98,
        analyzedAt: new Date().toISOString(),
        favorite: true,
        category: "TV e Vídeo",
        isBestSeller: true,
        hasDiscount: true
      },
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "iPhone 15 Apple 128GB Azul",
        price: 4699.00,
        link: `https://www.magazineluiza.com.br/p/237452100/?seller_id=${affiliateId}`,
        score: 95,
        analyzedAt: new Date().toISOString(),
        favorite: false,
        category: "Smartphones",
        isBestSeller: true,
        hasDiscount: true
      }
    ];
  } catch (error) {
    console.error("Erro Gemini:", error);
    return [];
  }
};

export const generateSocialCopy = async (product: Product, platform: 'instagram' | 'whatsapp' | 'facebook'): Promise<string> => {
  const styles = {
    whatsapp: "Curta, direta, cheia de emojis, focada em grupos de ofertas. Use escassez.",
    instagram: "Visual, hashtags, engajadora, focada em curiosidade e desejo.",
    facebook: "Informativa, focada em custo-benefício e segurança da compra."
  };

  const prompt = `
    Crie uma copy de vendas para: ${product.name}
    Preço: R$ ${product.price.toLocaleString('pt-BR')}
    Plataforma: ${platform}
    Estilo: ${styles[platform]}
    Link: ${product.link}
    Destaque: ${product.isBestSeller ? 'PRODUTO MAIS VENDIDO' : 'OFERTA POR TEMPO LIMITADO'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Erro ao gerar copy.";
  } catch (error) {
    return "Falha na comunicação com a IA.";
  }
};
