import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { customerSchema } from "../schemas/customerSchema";
import { useCreateCustomer } from "../hooks/useCustomers";

export function CustomerForm({ onClose }) {
  const create = useCreateCustomer({ onSuccess: onClose });
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(customerSchema) });
  return (
    <form onSubmit={handleSubmit((d) => create.mutate(d))} className="space-y-4" noValidate>
      <div>
        <label htmlFor="cname" className="label">Full Name</label>
        <input id="cname" {...register("name")} className="input" placeholder="Asha Rao" />
        {errors.name && <p className="error-text" role="alert">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="cemail" className="label">Email Address</label>
        <input id="cemail" {...register("email")} type="email" className="input" placeholder="asha@example.com" />
        {errors.email && <p className="error-text" role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="cphone" className="label">Phone Number</label>
        <input id="cphone" {...register("phone")} className="input" placeholder="+91-9000000001" />
        {errors.phone && <p className="error-text" role="alert">{errors.phone.message}</p>}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={create.isPending} aria-busy={create.isPending}>
          {create.isPending ? "Saving…" : "Create Customer"}
        </button>
      </div>
    </form>
  );
}