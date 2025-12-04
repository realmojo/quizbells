"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";

interface EmailSubscribeProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export default function EmailSubscribe({
  title = "새로운 소식을 받아보세요",
  description = "이메일을 입력하시면 최신 퀴즈 정보와 특별 이벤트 소식을 받아보실 수 있습니다.",
  placeholder = "이메일 주소를 입력하세요",
  buttonText = "구독하기",
  className = "",
}: EmailSubscribeProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("이메일 주소를 입력해주세요.");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail("");
        toast.success("구독이 완료되었습니다! 🎉");

        // 3초 후 성공 상태 초기화
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        toast.error(data.error || "구독에 실패했습니다.");
      }
    } catch (error) {
      console.error("이메일 구독 오류:", error);
      toast.error("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              이메일 주소
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                구독 완료!
              </>
            ) : (
              buttonText
            )}
          </Button>
        </form>

        <p className="mt-4 text-xs text-center text-gray-500">
          언제든지 구독을 취소할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
