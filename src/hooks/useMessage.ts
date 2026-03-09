import { toaster } from "@/components/ui/toaster"

type Props = {
  title: string,
  type: "success" | "error" | "warning" | "info" | "loading"
}

export const useMessage = () => {
  const showMessage = (props: Props) => {
      toaster.create({
      title: props.title,
      type: props.type,
      duration: 3000,
      closable: true
    });
  }

  return { showMessage }
}
