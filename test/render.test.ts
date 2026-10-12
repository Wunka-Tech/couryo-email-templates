import { describe, expect, it } from "vitest";
import { renderTemplate, templates, type TemplateId, type TemplatePropsMap } from "../src/index.js";

const EM_DASH = String.fromCharCode(0x2014); // the em dash character, never used in the copy

// React splits adjacent text nodes with <!-- -->; HTML-escape what the samples contain.
const clean = (html: string) => html.replace(/<!-- -->/g, "");

/** Values from the sample props that must show up in the output. */
const keyValues: Record<TemplateId, string[]> = {
  welcome: ["Ana", "https://exemplo.com.br/painel"],
  "email-confirmation": ["Ana", "https://exemplo.com.br/confirmar?t=abc123", "24"],
  "password-reset": ["https://exemplo.com.br/senha?t=abc123", "30"],
  "login-code": ["482913", "10"],
  "team-invite": ["Carlos Lima", "Loja Aurora", "https://exemplo.com.br/convite?t=abc123"],
  receipt: ["1042", "08/10/2026", "Pix", "R$ 129,90", "https://exemplo.com.br/recibos/1042"],
  "pix-charge": [
    "R$ 129,90",
    "10/10/2026",
    "00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-4266554400005204000053039865406129.905802BR5913LOJA AURORA6009SAO PAULO62070503***6304ABCD",
    "https://exemplo.com.br/pix/qr/1042.png",
    "https://exemplo.com.br/pagar/1042",
  ],
  boleto: ["R$ 129,90", "15/10/2026", "34191.79001 01043.510047 91020.150008 8 12340000012990", "https://exemplo.com.br/boletos/1042"],
  "payment-declined": ["R$ 99,00", "Pro", "https://exemplo.com.br/pagamento"],
  "subscription-renewed": ["Pro", "R$ 99,00", "08/11/2026", "https://exemplo.com.br/recibos/1043"],
  "subscription-canceled": ["Pro", "08/11/2026", "https://exemplo.com.br/assinatura"],
  "abandoned-cart": ["Camiseta Aurora (M)", "R$ 89,90", "https://exemplo.com.br/carrinho", "https://exemplo.com.br/descadastrar?t=abc123"],
  "order-shipped": ["1042", "Correios", "QB123456789BR", "14/10/2026", "https://exemplo.com.br/rastreio/QB123456789BR"],
};

/** A heading per language, to prove the copy switches. */
const headings: Record<TemplateId, { pt: string; en: string }> = {
  welcome: { pt: "Que bom ter você aqui, Ana!", en: "Great to have you here, Ana!" },
  "email-confirmation": { pt: "Confirme o seu e-mail", en: "Confirm your email" },
  "password-reset": { pt: "Redefinir senha", en: "Reset your password" },
  "login-code": { pt: "Seu código de acesso", en: "Your sign-in code" },
  "team-invite": { pt: "Você foi convidado", en: "You are invited" },
  receipt: { pt: "Pagamento recebido", en: "Payment received" },
  "pix-charge": { pt: "Seu Pix está pronto", en: "Your Pix is ready" },
  boleto: { pt: "Seu boleto chegou", en: "Your boleto is here" },
  "payment-declined": { pt: "O pagamento não passou", en: "The payment did not go through" },
  "subscription-renewed": { pt: "Assinatura renovada", en: "Subscription renewed" },
  "subscription-canceled": { pt: "Assinatura cancelada", en: "Subscription canceled" },
  "abandoned-cart": { pt: "Esqueceu alguma coisa?", en: "Forgot something?" },
  "order-shipped": { pt: "Pedido a caminho", en: "Order on the way" },
};

const render = <K extends TemplateId>(id: K, props: TemplatePropsMap[K]) => renderTemplate(id, props);

describe("registry", () => {
  it("has the 13 templates with unique ids and full metadata", () => {
    expect(templates).toHaveLength(13);
    expect(new Set(templates.map((t) => t.id)).size).toBe(13);
    for (const t of templates) {
      expect(["account", "billing", "commerce"]).toContain(t.category);
      expect(t.name.pt && t.name.en && t.description.pt && t.description.en).toBeTruthy();
    }
    expect(templates.filter((t) => t.stream === "marketing").map((t) => t.id)).toEqual(["abandoned-cart"]);
  });
});

describe.each(templates.map((t) => [t.id, t] as const))("%s", (id, t) => {
  for (const lang of ["pt", "en"] as const) {
    it(`renders in ${lang.toUpperCase()} with the sample values`, async () => {
      const r = await render(id, { ...t.previewProps, lang } as never);
      const html = clean(r.html);
      expect(html).toContain(lang === "pt" ? 'lang="pt-BR"' : 'lang="en"');
      expect(html).toContain(headings[id][lang]);
      for (const v of keyValues[id]) expect(html, `${id} ${lang} html: ${v}`).toContain(v.replace(/&/g, "&amp;"));
      expect(r.subject.length).toBeGreaterThan(3);
      expect(r.text.trim().length).toBeGreaterThan(40);
      // The plain text keeps the codes people need to copy.
      if (id === "pix-charge") expect(r.text).toContain((t.previewProps as { pixCode: string }).pixCode);
      if (id === "boleto") expect(r.text).toContain("34191.79001 01043.510047 91020.150008 8 12340000012990");
      for (const out of [r.html, r.text, r.subject]) {
        expect(out).not.toContain("{{");
        expect(out).not.toMatch(/undefined|\bnull\b|NaN|\[object Object\]/);
        expect(out).not.toMatch(/couryo/i);
        expect(out).not.toContain(EM_DASH);
        expect(out).not.toMatch(/\{[a-z]+\}/);
      }
      // Provider neutral by default.
      expect(html).toContain(lang === "pt" ? "Sua empresa" : "Your company");
    });
  }
});

describe("customization", () => {
  it("applies the brand name, logo, color and address", async () => {
    const r = await renderTemplate("pix-charge", {
      ...templates.find((t) => t.id === "pix-charge")!.previewProps,
      brand: { name: "Loja Aurora", logoUrl: "https://exemplo.com.br/logo.png", color: "#1d4ed8", address: "Rua das Flores, 100, São Paulo, SP" },
    } as never);
    expect(r.html).toContain('alt="Loja Aurora"');
    expect(r.html).toContain("https://exemplo.com.br/logo.png");
    expect(r.html).toContain("#1D4ED8");
    expect(r.html).toContain("Rua das Flores, 100, São Paulo, SP");
    expect(r.html).not.toContain("Sua empresa");
    expect(r.html).not.toContain("#C2410C");
  });

  it("uses the default button color and dark text on light brand colors", async () => {
    const base = await renderTemplate("welcome", { dashboardUrl: "https://exemplo.com.br/painel" });
    expect(base.html).toContain("#C2410C");
    const light = await renderTemplate("welcome", { dashboardUrl: "https://exemplo.com.br/painel", brand: { name: "Amarelo", color: "#FACC15" } });
    expect(light.html).toMatch(/color:#111111/);
  });

  it("uses the company name in EN copy only when given", async () => {
    const named = await renderTemplate("welcome", { lang: "en", customerName: "Ana", dashboardUrl: "https://example.com", brand: { name: "Aurora Shop" } });
    expect(named.subject).toBe("Welcome to Aurora Shop, Ana!");
    expect(clean(named.html)).toContain("Your Aurora Shop account is ready.");
    const plain = await renderTemplate("welcome", { lang: "en", dashboardUrl: "https://example.com" });
    expect(plain.subject).toBe("Welcome, friend!");
    expect(clean(plain.html)).toContain("Your account is ready.");
  });

  it("replaces the footer note", async () => {
    const r = await renderTemplate("receipt", {
      ...templates.find((t) => t.id === "receipt")!.previewProps,
      footerNote: "Dúvidas? [Fale conosco](https://exemplo.com.br/ajuda).",
    } as never);
    expect(clean(r.html)).toContain("Fale conosco");
    expect(r.html).toContain('href="https://exemplo.com.br/ajuda"');
    expect(r.html).not.toContain("porque tem uma conta conosco");
  });

  it("adds the unsubscribe link to the abandoned cart only when given", async () => {
    const props = { items: [{ name: "Caneca", quantity: 2, price: "R$ 40,00" }], total: "R$ 40,00", cartUrl: "https://exemplo.com.br/carrinho" };
    const without = await renderTemplate("abandoned-cart", props);
    expect(without.html).not.toContain("Não quero mais receber");
    const withLink = await renderTemplate("abandoned-cart", { ...props, unsubscribeUrl: "https://exemplo.com.br/sair?t=1" });
    expect(withLink.html).toContain('href="https://exemplo.com.br/sair?t=1"');
    expect(clean(withLink.html)).toContain("Não quero mais receber estes e-mails");
    expect(clean(withLink.html)).toContain("2x Caneca");
    expect(withLink.subject).toBe("Ei, seu carrinho está esperando");
  });

  it("treats data as plain text (no HTML or markup injection) and blocks unsafe links", async () => {
    const r = await renderTemplate("boleto", {
      customerName: "<b>Ana</b> **x**",
      amount: "R$ 1,00",
      dueDate: "01/01/2027",
      barcodeLine: "123",
      boletoUrl: "javascript:alert(1)",
    });
    expect(r.html).not.toContain("<b>Ana</b>");
    expect(r.html).toContain("&lt;b&gt;Ana&lt;/b&gt;");
    expect(clean(r.html)).toContain("**x**");
    expect(r.html).not.toContain("javascript:");
  });

  it("hides optional parts when their props are missing", async () => {
    const pix = await renderTemplate("pix-charge", { amount: "R$ 5,00", dueDate: "01/01/2027", pixCode: "000201", qrCodeUrl: "https://exemplo.com.br/qr.png" });
    expect(pix.html).not.toContain("Abrir a página de pagamento");
  });

  it("can skip the plain-text part", async () => {
    const r = await renderTemplate("login-code", { code: "111222" }, { plainText: false });
    expect(r.text).toBe("");
    expect(r.html).toContain("111222");
  });

  it("supports dark mode and mobile styles", async () => {
    const r = await renderTemplate("login-code", { code: "111222" });
    expect(r.html).toContain("prefers-color-scheme:dark");
    expect(r.html).toContain('name="color-scheme"');
    expect(r.html).toContain("max-width:620px");
  });
});
