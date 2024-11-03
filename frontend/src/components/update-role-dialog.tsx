import { z } from "zod";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/lib/api";
import { toast } from "sonner";
import { User } from "@/types/types";
import { ReloadIcon } from "@radix-ui/react-icons";

interface UpdateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userID: string;
}

export default function UpdateRoleDialog({
  open,
  onOpenChange,
  userID,
}: UpdateRoleDialogProps) {
  const queryClient = useQueryClient();
  const schema = z.object({ role: z.string({ required_error: "请选择身份" }) });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (updatedUser: User) => {
      onOpenChange(false);
      toast("修改身份成功");
      queryClient.setQueryData(["users"], (data: User[]) => {
        return data.map((user) => {
          if (user.id === updatedUser.id) {
            return updatedUser;
          }
          return user;
        });
      });
    },
  });

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改身份</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              mutation.mutate({
                role: data.role,
                userID,
              })
            )}
          >
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>身份</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择一种身份" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="普通助理">普通助理</SelectItem>
                      <SelectItem value="资深助理">资深助理</SelectItem>
                      <SelectItem value="黑心">黑心</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button disabled={mutation.isPending}>
                {mutation.isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mutation.isPending ? "请稍等" : "修改身份"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
