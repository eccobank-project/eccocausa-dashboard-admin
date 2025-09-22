import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-sm" size="sm" variant="outline">
          Soporte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envíanos tu feedback</DialogTitle>
          <DialogDescription>
            Comunícate con nosotros a través de nuestro{" "}
            <a className="text-foreground hover:underline" href="https://discord.gg/eccocausa">
              Discord
            </a>{" "}
            o por{" "}
            <a className="text-foreground hover:underline" href="https://t.me/eccocausa">
              Telegram
            </a>{" "}
            y envía tu mensaje para recibir ayuda de nuestro soporte.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5">
          <Textarea aria-label="Enviar feedback" id="feedback" placeholder="¿Cómo podemos mejorar Eccocausa?" />
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button type="button">Enviar feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
