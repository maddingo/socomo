package pl.gdela.socomo.bytecode;

import java.io.File;

import org.junit.experimental.runners.Enclosed;
import org.junit.runner.RunWith;

/**
 * The tests for analyzing bytecode produced for Java 8 runtime. Mind that probably your IDE
 * won't compile fixture classes to the {@code target/classes_java8} folder by itself,
 * you need to run {@code mvn compile} to have them compiled by maven as defined in the
 * {@code pom.xml} file of this module.
 */
@RunWith(Enclosed.class)
public final class Java8TestSuite {

	private static final File FIXTURE_ROOT = new File("target/classes_java8/fixture/");

	private Java8TestSuite() {}

	public static class T1 extends ClassAnalysisTest { public T1() { super(FIXTURE_ROOT); } }
	public static class T2 extends FieldAnalysisTest { public T2() { super(FIXTURE_ROOT); } }
	public static class T3 extends MethodAnalysisTest { public T3() { super(FIXTURE_ROOT); } }
	public static class T4 extends LambdaAnalysisTest { public T4() { super(FIXTURE_ROOT); } }

}
