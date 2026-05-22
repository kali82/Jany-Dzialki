import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "Imię i nazwisko musi mieć co najmniej 2 znaki." }),
  phone: z.string().min(9, { message: "Podaj prawidłowy numer telefonu." }),
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail." }),
  message: z.string().min(10, { message: "Wiadomość musi mieć co najmniej 10 znaków." }),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        let message = "Nie udało się wysłać wiadomości. Spróbuj ponownie później.";

        try {
          const data = (await response.json()) as { message?: unknown };
          if (typeof data.message === "string") {
            message = data.message;
          }
        } catch {
          // Keep the default message when the API response is not JSON.
        }

        throw new Error(message);
      }

      toast({
        title: "Wiadomość wysłana",
        description: "Dziękujemy za kontakt. Skontaktujemy się z Tobą wkrótce.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Nie wysłano wiadomości",
        description:
          error instanceof Error
            ? error.message
            : "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...form.register("website")}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię i nazwisko</FormLabel>
              <FormControl>
                <Input placeholder="Jan Kowalski" {...field} data-testid="input-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer telefonu</FormLabel>
              <FormControl>
                <Input placeholder="530 335 264" {...field} data-testid="input-phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres e-mail</FormLabel>
              <FormControl>
                <Input placeholder="jan.kowalski@example.com" {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wiadomość</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Dzień dobry, jestem zainteresowany działką..." 
                  className="min-h-[120px]"
                  {...field} 
                  data-testid="input-message"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground text-lg py-6"
          disabled={isSubmitting}
          data-testid="button-submit-contact"
        >
          {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
        </Button>
      </form>
    </Form>
  );
}
