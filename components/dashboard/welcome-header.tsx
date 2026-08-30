interface WelcomeHeaderProps {
  userName?: string;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {userName ? `Welcome back, ${userName}` : "Welcome back"}
      </h1>
      <p className="text-muted-foreground">
        Here&apos;s what&apos;s happening in your business today.
      </p>
    </div>
  );
}
